

# Create token for users

For production this must be implemented with a Django Signal `post_save`

```
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

for user in User.objects.all():
    Token.objects.get_or_create(user=user)
```


Token de prueba:

365b94f194c4661f145a95e0cf53d97bfcdace0e
