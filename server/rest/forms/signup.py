from django import forms
from ..models import User


class SignupForm(forms.Form):
    username = forms.CharField(required=True, min_length=4, error_messages={
        "required": "The username field is blank.",
        "min_length": "The username is not long enough.",
    })
    email = forms.EmailField(required=True, error_messages={
        "required": "The email field is blank.",
    })
    password = forms.CharField(required=True, min_length=4, error_messages={
        "required": "The password field is blank.",
        "min_length": "The password is not strong enough.",
    })

    def clean_username(self):
        username = self.data['username'].strip()

        if not username.isalnum():
            raise forms.ValidationError(f"Invalid username, please use only alpha-numeric characters.")

        account_exists = User.objects.filter(username__iexact=username).exists()
        if account_exists:
            raise forms.ValidationError(f"User already exists with the username {username}.")

        return username

    def clean_email(self):
        email = self.data['email'].strip().lower()

        account_exists = User.objects.filter(email=email).exists()
        if account_exists:
            raise forms.ValidationError(f"User already exists with the email {email}.")

        return email
