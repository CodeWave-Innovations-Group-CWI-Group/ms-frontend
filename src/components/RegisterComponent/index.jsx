import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import Register from "../../service/ms-authentication/Register.js"

export default function RegisterModule() {
  const YupSchema = Yup.object({
    name: Yup.string().min(15, "Digite seu Nome Completo.").required("Nome é obrigatório."),

    username: Yup.string()
      .min(3, "O nome de usuário deve ter no mínimo 3 letras.")
      .required("O nome de usuário é obrigatório."),

    email: Yup.string().email("Email inválido.").required("O email é obrigatório."),

    phone: Yup.string()
      .matches(/^[1-9]{2}9[0-9]{8}$/, "Digite um número válido com DDD, exemplo: 83940028922")
      .required("Telefone é obrigatório."),

    password: Yup.string()
      .min(6, "A senha deve ter no mínimo 6 caracteres.")
      .matches(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula.")
      .matches(/[@$!%*?&]/, "A senha deve conter pelo menos um caractere especial (@, $, !, %, *, ?, &).")
      .required("A senha é obrigatória."),

    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "As senhas não coincidem.")
      .required("A confirmação de senha é obrigatória."),
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full rounded-lg bg-white max-w-md shadow-2xl">
        <div className="bg-card rounded-lg border-2 border-gray-400 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Criar Conta</h1>
            <p className="text-muted-foreground text-gray-600">Preencha os dados para se cadastrar</p>
          </div>

          <Formik
            initialValues={{ name: "", username: "", email: "", phone: "", password: "", confirmPassword: "" }}
            validationSchema={YupSchema}
            onSubmit={async (values, { setSubmitting, setStatus }) => {
              try {
                setStatus(null)
                await Register(
                  values.name, values.username, values.email,
                  values.phone, values.password, values.confirmPassword,
                )
                setStatus({ type: "success", message: "Cadastro realizado com sucesso!" })
              } catch (error) {
                console.log(error)
                setStatus({ type: "error", message: error.message || "Erro ao realizar cadastro" })
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nome Completo</label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full px-3 py-2 bg-input bg-gray-300 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Nome completo"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="name" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nome De Usuário</label>
                    <Field
                      type="text"
                      name="username"
                      className="w-full px-3 py-2 bg-input bg-gray-300 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Nome de usuário"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="username" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                    <Field
                      type="text"
                      name="email"
                      className="w-full px-3 py-2 bg-input bg-gray-300 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="exemplo@gmail.com"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="email" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Telefone</label>
                    <Field
                      type="text"
                      name="phone"
                      className="w-full px-3 py-2 bg-input bg-gray-300 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Informe Seu Telefone"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="phone" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Senha</label>
                    <Field
                      type="text"
                      name="password"
                      className="w-full px-3 py-2 bg-input bg-gray-300 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Digite Sua Senha"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="password" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Confirmação De Senha</label>
                    <Field
                      type="text"
                      name="confirmPassword"
                      className="w-full px-3 py-2 bg-input bg-gray-300 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Confirme Sua Senha"
                      disabled={isSubmitting}
                    />
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-400 text-sm mt-1" />
                  </div>
                </div>


                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-2 bg-black/90 text-white font-semibold rounded-lg shadow-md hover:bg-black/70 cursor-pointer hover:scale-105"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                      Cadastrando...
                    </>
                  ) : (
                    "Cadastrar"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}