def get_display_name(user):
    if not user:
        return 'Anonymous'
    return user.username if user.is_authenticated else 'Anonymous'

def get_id(user):
    if not user:
        return 0
    return user.id if user.is_authenticated else 0