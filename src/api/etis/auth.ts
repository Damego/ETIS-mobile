import { cache } from '~/cache/smartCache';
import { UserCredentials } from '~/redux/reducers/accountSlice';
import { httpClient } from '~/utils';

export enum LoginResponseType {
  missingToken,
  invalidToken,
  success,
  failed,
  privacyPolicyNotAccepted,
  invalidUserCredentials,
  rateLimited,
}

export const makeLogin = async (
  token: string,
  userCredentials: UserCredentials,
  saveUserCredentials: boolean,
  isInvisibleRecaptcha: boolean
): Promise<{ code: LoginResponseType; message?: string }> => {
  if (!token) {
    return { code: LoginResponseType.missingToken };
  }
  if (!(await cache.hasAcceptedPrivacyPolicy()))
    return { code: LoginResponseType.privacyPolicyNotAccepted };

  const response = await httpClient.login(
    userCredentials.login,
    userCredentials.password,
    token,
    isInvisibleRecaptcha
  );

  if (response && response.error) {
    // У нас нет других вариантов проверять тип ошибки
    const message: string = response.error.message.toLowerCase();

    if (message.includes('проверк')) return { code: LoginResponseType.invalidToken };

    if (message.includes('лимит')) {
      return { code: LoginResponseType.rateLimited };
    }

    if (message.includes('неверное')) return { code: LoginResponseType.invalidUserCredentials };

    // Неизвестная ошибка
    return { code: LoginResponseType.failed, message };
  }

  if (saveUserCredentials) {
    await cache.placeUserCredentials(userCredentials);
  }
  return { code: LoginResponseType.success };
};
