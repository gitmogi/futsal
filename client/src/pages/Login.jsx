import Title from 'components/atoms/Title';
import * as Api from 'api/api';
import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { userPointState, userState } from 'stores/userStore';
import jwtDecode from 'jwt-decode';
import kakaoLoginImg from 'assets/image/kakao_login_medium_narrow.png';
import { loginImgList } from 'constants/imgList';
import FindPasswordModal from 'components/organisms/FindPasswordModal';
import Input from '../components/atoms/Input';

const Login = () => {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code`;
  const navigate = useNavigate();

  const setUserInfo = useSetRecoilState(userState);
  const setTotalPoint = useSetRecoilState(userPointState);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (userData) => {
    try {
      const result = await Api.post('auth/signin', userData);
      const { token, isAdmin } = result.data;
      localStorage.setItem('token', token);
      const { userId, name, role, isOAuth } = jwtDecode(token);
      const {
        data: { totalPoint },
      } = await Api.get('users/user');
      setUserInfo({
        userId,
        name,
        role,
        isOAuth,
        isAdmin,
      });
      setTotalPoint((prev) => ({ ...prev, totalPoint }));
      navigate('/');
    } catch (err) {
      alert(err.response.data.reason);
    }
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const toggleModal = useCallback(() => {
    setIsOpenModal((prev) => !prev);
  }, [isOpenModal]);

  const handleTest = async () => {
    try {
      const result = await Api.post('auth/signin', {
        email: 'test@gmail.com',
        password: 'test1234',
      });
      const { token, isAdmin } = result.data;
      localStorage.setItem('token', token);
      const { userId, name, role, isOAuth } = jwtDecode(token);
      const {
        data: { totalPoint },
      } = await Api.get('users/user');
      setUserInfo({
        userId,
        name,
        role,
        isOAuth,
        isAdmin,
      });
      setTotalPoint((prev) => ({ ...prev, totalPoint }));
      navigate('/');
    } catch (err) {
      alert(err.response.data.reason);
    }
  };

  return (
    <Container>
      <Image src={loginImgList[0]} />
      <InputContainer>
        <StyledTitle>
          "<span>?????? </span>
          <span>????????? </span>
          <span>?????????</span>"
        </StyledTitle>
        <KakaoLogin href={KAKAO_AUTH_URL}>
          <img src={kakaoLoginImg} alt={kakaoLoginImg} />
        </KakaoLogin>
        <form onSubmit={handleSubmit(onSubmit)}>
          <StyledInput
            placeholder='???????????? ?????????????????? :)'
            {...register('email', { required: '???????????? ??????????????????.' })}
          />
          <StyledInput
            type='password'
            placeholder='??????????????? ??????????????????'
            {...register('password', { required: '??????????????? ??????????????????.' })}
          />
          <LoginButton type='submit' value='?????????' />
        </form>
        <Wrapper>
          <Link to='/signup'>
            <StyledButton>????????????</StyledButton>
          </Link>
          <span style={{ marginLeft: 5, marginRight: 5 }}>???</span>
          <StyledButton onClick={toggleModal}>???????????? ??????</StyledButton>
          <TestButton onClick={handleTest}>???????????? ?????? ????????????</TestButton>
        </Wrapper>
      </InputContainer>
      {isOpenModal && <FindPasswordModal toggleModal={toggleModal} />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 4rem;
`;

const Image = styled.img`
  width: 450px;
  height: 100%;
  border-radius: 4px;
  margin: 0 3rem;
`;

const StyledTitle = styled(Title)`
  span {
    &:first-child {
      font-weight: 700;
    }
    &:last-child {
      font-weight: 700;
      color: #3563e9;
    }
  }
`;

const StyledInput = styled(Input)`
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 3rem;
`;

const KakaoLogin = styled.a`
  margin: 2rem 0;
`;

const LoginButton = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 0.5rem;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  color: white;
  background: #3563e9;
  &:hover {
    opacity: 0.7;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-start;
  margin-top: 0.3rem;

  span {
    opacity: 0.5;
  }
`;

const StyledButton = styled.button`
  color: #495057;
  &:hover {
    text-decoration: underline;
  }
`;

const TestButton = styled.button`
  margin-left: auto;
  font-weight: 550;
  color: #e03131;
`;

export default Login;
