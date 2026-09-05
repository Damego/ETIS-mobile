import { useAppSelector } from './redux';

// В оффлайн-режиме данные всегда берутся из кеша (useQuery переключает
// запросы на forceCache), поэтому pull-to-refresh и кнопки принудительного
// обновления бессмысленны и отключаются на уровне общих компонентов.
const useOfflineMode = () => useAppSelector((state) => state.account.isOfflineMode);

export default useOfflineMode;
