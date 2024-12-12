import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT

} from '../types/type';

export const login = (credentials) => {
  return async (dispatch) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: credentials.phoneNumber,
          password: credentials.password,
        }),
      });

      // Xử lý lỗi 403 hoặc phản hồi không hợp lệ
      if (!response.ok) {
        const errorText = await response.text(); // Lấy phản hồi dạng văn bản
        let errorMessage = 'An error occurred';
        try {
          const errorJson = JSON.parse(errorText); // Cố gắng parse JSON
          errorMessage = errorJson.message || errorMessage;
        } catch (err) {
          console.error('Error parsing response JSON:', err);
        }
        throw new Error(errorMessage);
      }

      // Phân tích phản hồi JSON
      const data = await response.json();
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token: data.token,
          user: data.user,
        },
      });
    } catch (error) {
      console.error("Login error:", error.message);
      dispatch({ type: LOGIN_FAILURE, payload: error.message });
    }
  };
};



export const logout = () => {
  return (dispatch) => {
    // Xóa JWT và thông tin người dùng từ localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Dispatch hành động LOGOUT để cập nhật state trong reducer
    dispatch({ type: LOGOUT });
  };
};
