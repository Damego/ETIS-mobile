import * as MailComposer from 'expo-mail-composer';

export default function composeMail(options: MailComposer.MailComposerOptions) {
  return MailComposer.composeAsync(options);
}