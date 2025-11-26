import hashlib

def hash_pass(password, user_id):
    if type(user_id) is int:
        user_id_str = str(user_id)
    hashed = hashlib.sha256((password + user_id_str).encode())
    return hashed.hexdigest()