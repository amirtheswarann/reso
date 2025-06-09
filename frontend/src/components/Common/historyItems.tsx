import {
  CompanyResearchService,
  type CompanyResearchHistoryResponse,
} from "@/client"
import useAuth from "@/hooks/useAuth"
import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { useQuery } from "@tanstack/react-query"
import { Link as RouterLink } from "@tanstack/react-router"
import { FiClock, FiEdit } from "react-icons/fi"
import type { IconType } from "react-icons/lib"

// Define the static menu items
const staticItems = [
  { icon: FiEdit, title: "New Research", path: "/", key: "newresearch" },
]

interface SidebarItemsProps {
  onClose?: () => void
}

interface Item {
  icon: IconType
  title: string
  path: string
  key: string
}

function getUserHistoryQueryOptions(currentUser: any) {
  return {
    queryKey: ["userHistory", currentUser?.id],
    queryFn: () => CompanyResearchService.getUserHistory(),
    enabled: !!currentUser?.id,
  }
}

const HistoryItems = ({ onClose }: SidebarItemsProps) => {
  const { user: currentUser } = useAuth()

  const { data: historyData, isLoading } = useQuery(
    getUserHistoryQueryOptions(currentUser),
  )

  const dynamicHistoryItems: Item[] =
    historyData?.map((historyItem: CompanyResearchHistoryResponse) => ({
      icon: FiClock,
      title: historyItem.company_name,
      path: `/h/${historyItem.id}`,
      key: historyItem.id,
    })) || []

  const finalItems: Item[] = [...staticItems, ...dynamicHistoryItems]

  const listItems = finalItems.map(({ icon, title, path, key }) => (
    <RouterLink key={key} to={path} onClick={onClose}>
      <Flex
        gap={4}
        px={4}
        py={2}
        _hover={{
          background: "gray.subtle",
        }}
        alignItems="center"
        fontSize="sm"
      >
        <Icon as={icon} alignSelf="center" />
        <Text ml={2}>{title}</Text>
      </Flex>
    </RouterLink>
  ))

  return (
    <>
      <Text fontSize="xs" px={4} py={2} fontWeight="bold">
        Menu
      </Text>
      <Box>{listItems}</Box>
    </>
  )
}

export default HistoryItems
