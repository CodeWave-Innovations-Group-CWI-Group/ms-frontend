import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { AuthContext } from "../../context/AuthContext"
import { useContext } from "react"

export default function LoginModule() {

  const { loginContext } = useContext(AuthContext);

  const YupSchema = Yup.object({
    email: Yup.string().email("Email inválido.").required("O email é obrigatório."),
    password: Yup.string()
      .required("A senha é obrigatória."),
  })

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full rounded-lg bg-white max-w-md shadow-2xl">
        <div className="bg-card rounded-lg border-2 border-gray-400 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Sistema de Gestão de Restaurante</h1>
            <p className="text-muted-foreground text-gray-600">Entre na sua Conta</p>
          </div>

          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={YupSchema}
            onSubmit={async (values) => {
              try {
                await loginContext(values.email, values.password)
              } catch (error) {
                console.log(error)
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">

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

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center px-4 py-2 bg-black/90 text-white font-semibold rounded-lg shadow-md hover:bg-black/70 cursor-pointer hover:scale-105"
                >
                    Entrar
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}