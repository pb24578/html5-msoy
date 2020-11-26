from django import forms
from ..models import User


class SignupForm(forms.Form):
    username = forms.CharField(required=True, min_length=4, error_messages={
        "min_length": "The username is not long enough."
    })
    email = forms.EmailField(required=True)
    password = forms.CharField(required=True, min_length=4, error_messages={
        "min_length": "The password is not strong enough."
    })

    def clean_username(self):
        username = self.data['username']

        account_exists = User.objects.filter(username__iexact=username).exists()
        if account_exists:
            raise forms.ValidationError(f"User already exists with the username {username}.")

        return username

    def clean_email(self):
        email = self.data['email'].lower()

        account_exists = User.objects.filter(email=email).exists()
        if account_exists:
            raise forms.ValidationError(f"User already exists with the email {email}.")

        return email
