// src/application/validators/userValidator.js
import * as yup from 'yup';

// Definindo o esquema de validação para registro de usuário
const registerUserSchema = yup.object().shape({
  nome: yup.string().required('O nome é obrigatório'),
  email: yup.string().email('E-mail inválido').required('O e-mail é obrigatório'),
  cpf: yup.string().matches(/^\d{11}$/, 'CPF inválido').required('O CPF é obrigatório'),
  senha: yup.string().min(6, 'A senha deve ter pelo menos 6 caracteres').required('A senha é obrigatória'),
  tipo: yup.string().oneOf(['admin', 'user'], 'Tipo de usuário inválido').required('O tipo de usuário é obrigatório'),
});

// Exportando o esquema de validação
export { registerUserSchema };
