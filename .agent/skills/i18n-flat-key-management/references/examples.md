# i18n Examples

## Flat snake_case keys

GOOD

```json
{
  "auth_login_title": "Đăng nhập",
  "auth_login_subtitle": "Chào mừng bạn quay lại"
}
```

BAD

```json
{
  "auth": {
    "login": {
      "title": "Đăng nhập"
    }
  }
}
```

## Locale parity

GOOD

```text
[LOCALE_A].json: auth_login_title
[LOCALE_B].json: auth_login_title
```

BAD

```text
[LOCALE_A].json has: dashboard_due_tomorrow
[LOCALE_B].json missing: dashboard_due_tomorrow
```
