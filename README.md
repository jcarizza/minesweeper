

# Create token for users

For production this must be implemented with a Django Signal `post_save`

```
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

for user in User.objects.all():
    Token.objects.get_or_create(user=user)
```


# Authentication

Choose Token to authenticate users. Create one token per user. Would be better to use temporal tokens.


# About model design

I used one model and a field thath store the array map in json for convenience.


# API Doc

https://documenter.getpostman.com/view/446800/minesweeper/RW1gEGs9#4ea20805-094e-cb21-39d0-85c216f7e977



Game at minesweeper.jcarizza.com
Api at api-ms.jcarizza.com

