export type FormControlProps = {
  label: string;
  description?: string;
};

export type FormBaseProps = FormControlProps & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};
