import { useColorModeValue } from "@/components/ui/color-mode"
import {
  Container,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { useForm, type SubmitHandler } from "react-hook-form"
import { FiLock, FiMail } from "react-icons/fi"

import type { Body_login_login_access_token as AccessToken } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { Logo } from "@/components/ui/logo"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { emailPattern, passwordRules } from "@/utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" })
    }
  },
})

function Login() {
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    defaultValues: { username: "", password: "" },
    mode: "onBlur",
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return
    resetError()
    try {
      await loginMutation.mutateAsync(data)
    } catch {}
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      px={4}
    >
      <Container
        maxW="md"
        p={8}
        bg={useColorModeValue("white", "gray.800")}
        borderRadius="md"
        boxShadow="lg"
      >
        <VStack gap={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Image src={Logo()} alt="Company Researcher Logo" maxW="150px" />
          <Heading size="lg" textAlign="center">
            Welcome Back to Company Researcher
          </Heading>
          <Field
            invalid={!!errors.username}
            errorText={errors.username?.message || !!error}
          >
            <InputGroup w="100%" startElement={<FiMail />}>
              <Input
                {...register("username", {
                  required: "Email is required",
                  pattern: emailPattern,
                })}
                placeholder="Email"
                type="email"
              />
            </InputGroup>
          </Field>
          <PasswordInput
            type="password"
            startElement={<FiLock />}
            {...register("password", passwordRules())}
            placeholder="Password"
            errors={errors}
          />
          <Flex justify="flex-end" w="100%">
            <RouterLink to="/recover-password" className="main-link">
              <Text fontSize="sm" color="blue.500">
                Forgot Password?
              </Text>
            </RouterLink>
          </Flex>
          <Button type="submit" loading={isSubmitting} size="lg" w="full">
            Log In
          </Button>
          <Text>
            New here?{" "}
            <RouterLink to="/signup" className="main-link">
              <Text as="span" color="blue.500" fontWeight="semibold">
                Create an account
              </Text>
            </RouterLink>
          </Text>
        </VStack>
      </Container>
    </Flex>
  )
}
