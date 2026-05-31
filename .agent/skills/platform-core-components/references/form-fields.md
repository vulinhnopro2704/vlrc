# Custom Form Fields API Reference

This manual provides prop definitions and copy-pasteable snippets for all 10 specialized form field wrappers in `@platform-core/components`. All of these automatically wire up inside a `<Form>` container using `control` and `name` attributes.

---

## 📖 Table of Contents
1. [FormInput (Text, Email, Phone, Password)](#1-forminput-text-email-phone-password)
2. [FormTextarea (Multiline Text Box)](#2-formtextarea-multiline-text-box)
3. [FormCheckbox (Single Boolean Toggle)](#3-formcheckbox-single-boolean-toggle)
4. [FormSimpleSelect (Direct Inline Dropdown)](#4-formsimpleselect-direct-inline-dropdown)
5. [FormSelect (Advanced Single & Multi-Select)](#5-formselect-advanced-single-multi-select)
6. [FormMultiSelect (Popover Tag List Selection)](#6-formmultiselect-popover-tag-list-selection)
7. [FormDatePicker (Calendars & DateTime Selectors)](#7-formdatepicker-calendars-datetime-selectors)
8. [FormNumberInput (Numeric Format with Steppers)](#8-formnumberinput-numeric-format-with-steppers)
9. [FormRadioGroup (Radio Option List)](#9-formradiogroup-radio-option-list)
10. [FormFileUpload (Avatar & File Drag & Drop)](#10-formfileupload-avatar-file-drag--drop)

---

## 1. `<FormInput>` (Text, Email, Phone, Password)
Unifies standard text, email, phone, and password inputs.
- **Automatic Password Eye**: Renders `Icons.Eye`/`Icons.EyeOff` toggle button automatically when `htmlType="password"`.
- **Regex Validations**: Automatically hooks Vietnamese phone numbers and email formats to validators if `htmlType="tel"` or `"email"` is declared and no custom pattern overrides are passed.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `htmlType` | `'text' \| 'password' \| 'email' \| 'tel' \| 'url'` | `'text'` | Directs input format styles. |
| `leftIcon` | `ReactNode` | - | Prefix icon aligned inside the input box. |
| `rightIcon` | `ReactNode` | - | Suffix icon aligned inside the input box. |
| `placeholder` | `string` | - | Input placeholder. |
| `disabled` | `boolean` | `false` | Disable state toggle. |
| `inputClassName` | `string` | `''` | Direct class overrides for the raw `<input>` element. |

```tsx
<FormInput
  control={control}
  name="email"
  label="Email đăng nhập"
  htmlType="email"
  leftIcon={<Icons.Mail className="h-4 w-4" />}
  rules={{ required: 'Bắt buộc nhập email' }}
/>

<FormInput
  control={control}
  name="password"
  label="Mật khẩu"
  htmlType="password"
  leftIcon={<Icons.Lock className="h-4 w-4" />}
  rules={{ required: 'Bắt buộc nhập mật khẩu' }}
/>
```

---

## 2. `<FormTextarea>` (Multiline Text Box)
Renders a custom styled multiline text area input box.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `disabled` | `boolean` | `false` | Disable interactions. |
| `placeholder` | `string` | - | Textarea placeholder text. |

```tsx
<FormTextarea
  control={control}
  name="notes"
  label="Ghi chú thêm"
  placeholder="Ghi chú thông tin bổ sung cho giáo viên..."
/>
```

---

## 3. `<FormCheckbox>` (Single Boolean Toggle)
Sets `horizontal={true}` and `controlFirst={true}` automatically to align checkbox widgets inline before their descriptive labels.

```tsx
<FormCheckbox
  control={control}
  name="agree"
  label="Tôi đồng ý với điều khoản dịch vụ"
  rules={{ required: 'Bạn phải chấp nhận điều khoản' }}
/>
```

---

## 4. `<FormSimpleSelect>` (Direct Inline Dropdown)
A simple select dropdown box that utilizes inline children rather than data objects. Useful for quick static lists.

```tsx
<FormSimpleSelect
  control={control}
  name="role"
  label="Vai trò tài khoản"
>
  <SelectItem value="student">Học sinh</SelectItem>
  <SelectItem value="teacher">Giáo viên</SelectItem>
  <SelectItem value="admin">Quản trị viên</SelectItem>
</FormSimpleSelect>
```

---

## 5. `<FormSelect>` (Advanced Single & Multi-Select)
An advanced select popover wrapping `@platform-core/components`'s custom `Select` dropdown. Highly optimized for larger searchable lists.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `BaseSelectOption<T>[]` | `[]` | Choice items array `{ value, label }`. |
| `isMulti` | `boolean` | `false` | Enable multi-selection list mode. |
| `isClearable` | `boolean` | `true` | Show close/reset values triggers. |
| `isSearchable` | `boolean` | `true` | Enables keyword search filtering inside popover. |
| `isLoading` | `boolean` | `false` | Spinner indicator. |

```tsx
// Single Selection Choice
<FormSelect
  control={control}
  name="subject"
  label="Môn học chính"
  options={[
    { value: 'english', label: 'Tiếng Anh' },
    { value: 'japanese', label: 'Tiếng Nhật' }
  ]}
  isClearable={false}
/>

// Multi Selection List Choice
<FormSelect
  control={control}
  name="topics"
  label="Chủ đề quan tâm"
  isMulti={true}
  options={[
    { value: 'vocab', label: 'Từ vựng' },
    { value: 'grammar', label: 'Ngữ pháp' }
  ]}
/>
```

---

## 6. `<FormMultiSelect>` (Popover Tag List Selection)
A custom multi-select tag picker displaying checked tags and selection triggers in a dropdown menu.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `BaseSelectOption[]` | `[]` | Dropdown items. |
| `placeholder` | `string` | `'Chọn...'` | Trigger placeholder text. |
| `showSelectAll` | `boolean` | `false` | Displays a global toggle button checking all items. |
| `maxTagCount` | `number \| 'responsive'` | `'responsive'` | Maximum tag pills visible. |

```tsx
<FormMultiSelect
  control={control}
  name="hobbies"
  label="Sở thích cá nhân"
  options={[
    { value: 'sport', label: 'Thể thao' },
    { value: 'music', label: 'Âm nhạc' },
    { value: 'reading', label: 'Đọc sách' }
  ]}
  showSelectAll={true}
/>
```

---

## 7. `<FormDatePicker>` (Calendars & DateTime Selectors)
Handles single date picks, range selection, datetime inputs, and month/year picks.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isRangePicker` | `boolean` | `false` | Range picking toggle (returns `[Date, Date]`). |
| `pickerType` | `'date' \| 'time' \| 'datetime' \| 'month' \| 'year'` | `'date'` | Control calendar granularity. |
| `dateFormat` | `string` | - | Mask format (e.g. `'yyyy-MM-dd HH:mm'`). |
| `showTime` | `boolean \| TimeConfig` | `false` | Toggles sub-hour steps. |
| `disabledDate` | `(date: Date) => boolean` | - | Callback function blocking custom dates. |

```tsx
// Single Date Selection
<FormDatePicker
  control={control}
  name="birthDate"
  label="Ngày sinh"
  placeholder="Chọn ngày sinh..."
/>

// Time & Date Selection
<FormDatePicker
  control={control}
  name="schedule"
  label="Lịch hẹn tư vấn"
  pickerType="datetime"
  showTime={true}
  dateFormat="dd/MM/yyyy HH:mm"
/>

// Date Range Selection
<FormDatePicker
  control={control}
  name="vacation"
  label="Thời gian nghỉ phép"
  isRangePicker={true}
  placeholder="Ngày đi ~ Ngày về"
/>
```

---

## 8. `<FormNumberInput>` (Numeric Format with Steppers)
A numerical formatted controller that parses input values, triggers step increment/decrement, and formats thousands or decimals.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `stepper` | `number` | `1` | Stepper size limit. |
| `minValue` | `number` | `Number.NEGATIVE_INFINITY` | Lower boundary. |
| `maxValue` | `number` | `Number.POSITIVE_INFINITY` | Upper boundary. |
| `thousandSeparator` | `string` | - | Thousands separator character (e.g. `','`). |
| `prefix` | `string` | - | String leading numeric values. |
| `suffix` | `string` | - | String appending numeric values. |

```tsx
// Standard Numerical Stepper
<FormNumberInput
  control={control}
  name="order"
  label="Thứ tự hiển thị"
  minValue={1}
  maxValue={50}
/>

// Currency mask input
<FormNumberInput
  control={control}
  name="salary"
  label="Mức lương đề xuất"
  thousandSeparator=","
  suffix=" VND"
  minValue={0}
/>
```

---

## 9. `<FormRadioGroup>` (Radio Option List)
Renders custom radio buttons formatted cleanly vertically or horizontally.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `options` | `RadioOption[]` | `[]` | Choices list `{ value, label, disabled }`. |
| `size` | `'small' \| 'middle' \| 'large'` | `'middle'` | Scale constraints. |
| `autoHeightMax` | `number` | - | Renders list with vertical scrolls if overflow active. |

```tsx
<FormRadioGroup
  control={control}
  name="level"
  label="Trình độ"
  options={[
    { value: 'basic', label: 'Cơ bản' },
    { value: 'advanced', label: 'Nâng cao' }
  ]}
/>
```

---

## 10. `<FormFileUpload>` (Avatar & File Drag & Drop)
A comprehensive drag and drop or circle avatar component with automatic cloud uploads or manual form submission files.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `variant` | `'default' \| 'avatar'` | `'default'` | Avatar renders a round image circle selector. |
| `maxFiles` | `number` | `1` | Maximum quantity. |
| `maxSize` | `number` | `5MB` | Maximum size limit. |
| `accept` | `string` | `'image/*'` | Mime formats. |
| `autoUpload` | `boolean` | `false` | Immediate upload trigger. |
| `uploadFile` | `(file: File) => Promise<string>` | - | **(Required if autoUpload: true)** Custom cloud upload hook. |

```tsx
// circular profile uploader with immediate S3 upload
<FormFileUpload
  control={control}
  name="profilePic"
  label="Ảnh hồ sơ cá nhân"
  variant="avatar"
  autoUpload={true}
  uploadFile={async (file) => {
    const url = await uploadToCloudStorage(file);
    return url;
  }}
/>

// drag & drop local attachments loader
<FormFileUpload
  control={control}
  name="cvAttachments"
  label="Hồ sơ đính kèm (CV)"
  variant="default"
  accept=".pdf,.doc"
  maxFiles={2}
  autoUpload={false}
/>
```
