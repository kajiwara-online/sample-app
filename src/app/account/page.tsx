import AccountForm from "./account-form";
import { createClient } from "@/app/utils/supabase/server";

export default async function Account() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AccountForm user={user} />;
}

// "data": {
//     "user": {
//       "id": "ac1af994-a387-45b0-acf7-cade291a1492",
//       "aud": "authenticated",
//       "role": "authenticated",
//       "email": "g.k0321aaauuu@gmail.com",
//       "email_confirmed_at": "2025-05-11T06:09:47.808993Z",
//       "phone": "",
//       "confirmation_sent_at": "2025-05-11T06:09:17.216016Z",
//       "confirmed_at": "2025-05-11T06:09:47.808993Z",
//       "last_sign_in_at": "2025-05-11T07:48:36.402155Z",
//       "app_metadata": {
//         "provider": "email",
//         "providers": [
//           "email"
//         ]
//       },
