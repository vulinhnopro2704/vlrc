# DataTable (Shadcn + TanStack Table) Composition Reference

The `DataTable` component from `@platform-core/components` is a high-level wrapper built on top of **Shadcn UI** table primitives and **TanStack Table v8**. It unifies pagination, row selection, row actions, expandable rows, search filtering, and loading states into a highly declarative API.

---

## 📊 1. DataTable API Reference

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `columns` | `ColumnDef<T>[]` | - | **(Required)** Column definitions following TanStack Table schema. |
| `data` | `T[]` | - | **(Required)** Row data array. |
| `isLoading` | `boolean` | `false` | Renders a centralized dynamic loader overlay when active. |
| `pageSize` | `number` | `10` | Default quantity of rows displayed per pagination page. |
| `searchPlaceholder` | `string` | `'Tìm kiếm...'` | Descriptive text inside the filter search bar. |
| `searchKey` | `string` | - | The column key used for search filtering. |

---

## 🛠 2. Standard Column Creation Helpers

To maintain design systems and avoid boilerplate, use these pre-packaged column helpers:

### 2.1 selection checkbox column
- **Helper**: `createSelectionColumn<T>()`
- **Output**: Returns a `ColumnDef<T>` rendering a header-level and row-level selection checkbox.

### 2.2 Expandable Row Trigger
- **Helper**: `createExpanderColumn<T>()`
- **Output**: Returns a `ColumnDef<T>` rendering a caret button that toggles nested child row visibility.

### 2.3 Row Actions Column
- **Helper**: `createRowActionsColumn<T>({ renderActions })`
- **Arguments**:
  - `renderActions`: `(helpers: { row: Row<T> }) => ReactNode` - Function to display interactive buttons (edit, delete, etc.).

---

## 📝 3. Fully Integrated Query-Bound DataTable Example

This copy-pasteable example shows how to connect `DataTable` with a TanStack Query hook, define typed columns, and render custom row action controls safely.

```tsx
import type { ColumnDef } from '@tanstack/react-table';

interface CourseRow {
  id: number;
  title: string;
  order: number;
  wordCount: number;
  isActive: boolean;
}

const CourseTableSection = () => {
  const { t } = useTranslation();
  
  // 1. TanStack Query Data Source
  const coursesQuery = useCoursesQuery({ take: 50 });
  const data = coursesQuery.data?.data ?? [];

  // 2. Memoized Column Definitions (TanStack + Shadcn Primitives)
  const columns = useMemo((): ColumnDef<CourseRow>[] => [
    // Renders checkbox column automatically
    createSelectionColumn<CourseRow>(),
    {
      accessorKey: 'title',
      header: t('course_title', 'Tên khóa học'),
      cell: ({ row }) => <span className="font-semibold text-foreground">{row.original.title}</span>
    },
    {
      accessorKey: 'wordCount',
      header: t('course_words', 'Số lượng từ'),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.wordCount} từ</span>
    },
    {
      accessorKey: 'isActive',
      header: t('status', 'Trạng thái'),
      cell: ({ row }) => (
        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
          row.original.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.original.isActive ? 'Kích hoạt' : 'Bản nháp'}
        </span>
      )
    },
    // Renders action panel containing inline buttons
    createRowActionsColumn<CourseRow>({
      renderActions: ({ row }) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(row.original)}>
            <Icons.Edit className="h-4 w-4 text-muted-foreground hover:text-primary" />
          </Button>
          <Button variant="ghost" size="icon-sm" className="hover:text-destructive" onClick={() => handleDelete(row.original)}>
            <Icons.Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
      )
    })
  ], [t]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <DataTable
        columns={columns}
        data={data}
        isLoading={coursesQuery.isLoading}
        pageSize={10}
        searchPlaceholder="Tìm kiếm khóa học..."
        searchKey="title"
      />
    </div>
  );
};
```
