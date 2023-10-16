import { forwardRef } from "react";
import { Select, SelectProps } from "..";


export const MonthsSelect = forwardRef<HTMLSelectElement, SelectProps>(function MonthsSelect(props, ref) {

  return (
    <Select {...props} ref={ref}>
        <option value="01">Janeiro</option>
        <option value="02">Fevereiro</option>
        <option value="03">Março</option>
        <option value="04">Abril</option>
        <option value="05">Maio</option>
        <option value="06">Junho</option>
        <option value="07">Julho</option>
        <option value="08">Agosto</option>
        <option value="09">Setembro</option>
        <option value="10">Outubro</option>
        <option value="11">Novembro</option>
        <option value="12">Dezembro</option>
    </Select>
  );
});