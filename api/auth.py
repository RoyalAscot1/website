import os
import httpx
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

CLERK_JWKS_URL = os.getenv("CLERK_JWKS_URL")
security = HTTPBearer()
_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    global _jwks_cache
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            r = await client.get(CLERK_JWKS_URL)
            r.raise_for_status()
            _jwks_cache = r.json()
    return _jwks_cache


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Security(security),
) -> str:
    token = credentials.credentials
    global _jwks_cache
    try:
        jwks = await _get_jwks()
        header = jwt.get_unverified_header(token)
        key = next(k for k in jwks["keys"] if k["kid"] == header["kid"])
        payload = jwt.decode(token, key, algorithms=["RS256"])
        return payload["sub"]
    except StopIteration:
        # kid not found — Clerk may have rotated keys; clear cache so next request re-fetches
        _jwks_cache = None
        raise HTTPException(status_code=401, detail="Token signing key not recognized")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
