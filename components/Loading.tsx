import  styled  from "styled-components"
import Image from 'next/image'
import WhatsAppLogo from '../src/assets/yourvibes.png'
import CircularProgress from "@mui/material/CircularProgress"

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
`

const StyledImageWrapper = styled.div`
  margin-bottom: 50px;
`
const Loading = () => {
  return (
    <StyledContainer>
        <StyledImageWrapper>
            <Image src={WhatsAppLogo} alt="Whatsapp Logo" height={200} width={500} />
        </StyledImageWrapper>

        <CircularProgress />
    </StyledContainer>
  )
}

export default Loading
