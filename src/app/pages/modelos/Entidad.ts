import { TipoDocumento } from './TipoDocumento';
import { TipoContribuyente } from './TipoContribuyente';

export class Entidad{
    id_entidad        :number;
    tipoDocumento     :TipoDocumento;
    nro_documento     :string;
    razon_social      :string;
    nombre_comercial  :string;
    tipoContribuyente :TipoContribuyente;
    direccion         :string;
    telefono          :string;
    estado            :boolean;
}