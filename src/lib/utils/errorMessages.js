export const getLoginErrorMessage = (error) => {
  if (!error?.response) {
    return '서버와의 통신 오류가 발생했습니다. 네트워크 연결을 확인해주세요.';
  }

  const { status, data } = error.response;
  const serverMessage = data?.message || '';

  switch (status) {
    case 400:
      if (
        serverMessage.includes('password') ||
        serverMessage.includes('비밀번호')
      ) {
        return '비밀번호가 올바르지 않습니다.';
      }
      if (serverMessage.includes('email') || serverMessage.includes('이메일')) {
        return '존재하지 않는 이메일입니다.';
      }
      if (
        serverMessage.includes('credential') ||
        serverMessage.includes('인증')
      ) {
        return '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
      return serverMessage || '입력 정보를 확인해주세요.';

    case 401:
      return '이메일 또는 비밀번호가 올바르지 않습니다.';

    case 403:
      return '로그인이 차단되었습니다. 관리자에게 문의하세요.';

    case 404:
      return '존재하지 않는 이메일입니다.';

    case 429:
      return '로그인 시도 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.';

    case 500:
    case 502:
    case 503:
    case 504:
      return '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.';

    default:
      return (
        serverMessage || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
  }
};
