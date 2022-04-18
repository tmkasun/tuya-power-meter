import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export enum EnergyParameterTypes {
  Power = "power",
  Voltage = "voltage",
  TotalEnergy = "totalEnergy",
}
interface EnergyParametersProps {
  parameters: EnergyParameterTypes[];
  selected: EnergyParameterTypes;
  onChange: any;
}

export default function EnergyParameters({
  parameters,
  selected,
  onChange
}: EnergyParametersProps) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={selected}
      exclusive
      onChange={onChange}
    >
      {parameters.map((parameter) => (
        <ToggleButton key={parameter} value={parameter}>
          {parameter}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
