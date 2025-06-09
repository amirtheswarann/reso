// src/routes/signup.tsx

import { useColorModeValue } from "@/components/ui/color-mode"
import {
  Container,
  Flex,
  Heading,
  Image,
  Input,
  Text,
  VStack
} from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { useForm, type SubmitHandler } from "react-hook-form"
import { FiLock, FiUser } from "react-icons/fi"

import type { UserRegister } from "@/client"
import { Button } from "@/components/ui/button"
import { Field } from "@/components/ui/field"
import { InputGroup } from "@/components/ui/input-group"
import { Logo } from "@/components/ui/logo"
import { PasswordInput } from "@/components/ui/password-input"
import useAuth, { isLoggedIn } from "@/hooks/useAuth"
import { confirmPasswordRules, emailPattern, passwordRules } from "@/utils"

export const Route = createFileRoute("/signup")({
  component: SignUp,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({ to: "/" })
    }
  },
})

interface UserRegisterForm extends UserRegister {
  confirm_password: string
}

function SignUp() {
  const { signUpMutation } = useAuth()
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterForm>({
    defaultValues: {
      email: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  })

  const onSubmit: SubmitHandler<UserRegisterForm> = (data) => {
    signUpMutation.mutate(data)
  }

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.900")}
      px={4}
    >
      <Container maxW="md" p={8} bg="white" borderRadius="md" boxShadow="lg">
        <VStack gap={6} as="form" onSubmit={handleSubmit(onSubmit)}>
          <Image src={Logo()} alt="Company Researcher Logo" maxW="150px" />
          <Heading size="lg" textAlign="center">
            Join Company Researcher
          </Heading>
          <Field invalid={!!errors.full_name} errorText={errors.full_name?.message}>
            <InputGroup w="100%" startElement={<FiUser />}>
              <Input
                {...register("full_name", { required: "Full Name is required", minLength: 3 })}
                placeholder="Full Name"
                type="text"
              />
            </InputGroup>
          </Field>
          <Field invalid={!!errors.email} errorText={errors.email?.message}>
            <InputGroup w="100%" startElement={<FiUser />}>
              <Input
                {...register("email", { required: "Email is required", pattern: emailPattern })}
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
          <PasswordInput
            type="password"
            startElement={<FiLock />}
            {...register("confirm_password", confirmPasswordRules(getValues))}
            placeholder="Confirm Password"
            errors={errors}
          />
          <Button type="submit" loading={isSubmitting} size="lg" w="full">
            Create Account
          </Button>
          <Text>
            Already have an account?{" "}
            <RouterLink to="/login" className="main-link">
              <Text as="span" color="blue.500" fontWeight="semibold">
                Log In
              </Text>
            </RouterLink>
          </Text>
        </VStack>
      </Container>
    </Flex>
  )
}
