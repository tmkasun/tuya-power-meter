import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
type EnergyDatePickerProps = {
  label: string;
  value: any;
  setValue: any;
};
export default function EnergyDatePicker(props: EnergyDatePickerProps) {
  const {label, value, setValue} = props;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={setValue}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}
