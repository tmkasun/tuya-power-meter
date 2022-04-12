import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDayjs";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import { Box, BoxProps } from "@mui/material";
interface EnergyDatePickerProps extends BoxProps {
  label: string;
  value: any;
  setValue: (date: any, keyboardInputValue?: string) => void;
};
export default function EnergyDatePicker(props: EnergyDatePickerProps) {
  const { label, value, setValue, ...boxProps } = props;

  return (
    <Box {...boxProps}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={label}
          value={value}
          onChange={setValue}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Box>
  );
}
