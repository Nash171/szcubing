import { Box } from '@chakra-ui/react'
import React from 'react'

export default function Page({ children }: { children: React.ReactNode }) {
  return (
    <div>
        <Box maxWidth={'1200px'} margin={'0 auto'} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            {children}
        </Box>
    </div>
  )
}
