import { useColorModeValue } from "@/components/ui/color-mode";
import LogoDark from "/assets/images/stari-logo-dark.svg";
import LogoLight from "/assets/images/stari-logo-light.svg";

export const Logo = () => {
  return useColorModeValue(LogoLight, LogoDark)
}
