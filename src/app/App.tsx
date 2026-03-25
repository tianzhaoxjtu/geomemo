import { HomePage } from "../pages/home/HomePage";
import { I18nProvider } from "../shared/i18n/I18nProvider";

export function App() {
  return (
    <I18nProvider>
      <HomePage />
    </I18nProvider>
  );
}
