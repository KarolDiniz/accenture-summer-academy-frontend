import { useController } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const AutocompleteRHF = ({ defaultProps, control, name, rules, ...rest }) => {
  const {
    field: { onChange, value, ref },
    fieldState: { invalid, isTouched, isDirty },
    formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { ...rules },
  });

  const id = rest.id ? rest.id : name;
  const labelText = rest.tag ? rest.tag : rest.label;

  return (
    <Autocomplete
      {...defaultProps}
      name={name}
      onChange={(event, newValue) => {
        onChange(newValue ? newValue.id : null);
      }}
      control={control}
      renderInput={(params) => (
        <TextField
          {...rest}
          {...params}
          helperText={rest.helperText}
          inputRef={ref}
        />
      )}
    />
  );
};

export default AutocompleteRHF;
