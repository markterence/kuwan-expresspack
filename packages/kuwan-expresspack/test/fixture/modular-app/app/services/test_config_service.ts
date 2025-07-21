import { useAppConfig } from '@markterence/kuwan-expresspack'

export function getTestValue() {
  const config = useAppConfig('mail');
  return config;
}