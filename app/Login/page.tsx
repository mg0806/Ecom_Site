import Container from '@/components/universal/Container';
import FormWrap from '@/components/Products/FormWarp';
import LoginForm from './LoginForm';
import { getCurrentUser } from '@/actions/getCurrentUser';
const Login = async () => {

    const currentUser = await getCurrentUser();
    return ( 

        <Container>
            <FormWrap>
                <LoginForm currentUser = {currentUser}/>
            </FormWrap>
        </Container>
     );
}
 
export default Login;