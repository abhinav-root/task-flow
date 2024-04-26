import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { Tailwind } from "@react-email/tailwind";
import * as React from "react";
import { renderAsync } from "@react-email/render";

interface EmailProps {
  username: string;
  code: string;
}

export default function EmailVerificationTemplate({
  username,
  code,
}: EmailProps) {
  return (
    <Html>
      <Preview>Task Flow Email Verification Code</Preview>
      <Head />
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans px-2">
          <Container>
            <Text className="bg-white font-extrabold text-3xl text-center text-blue-500 uppercase">
              Task Flow
            </Text>
            <Section className="bg-blue-500 py-4">
              <Text className=" text-center text-white font-light text-lg tracking-wider">
                Thank you for signing up
              </Text>
              <Text className=" text-center text-white font-bold text-2xl tracking-wide">
                Verify Your E-mail Address
              </Text>
            </Section>
            <Section className="text-gray-600">
              <Text>Hello {username},</Text>
              <Text>Please use the following Code</Text>
              <Text className="text-gray-900 text-2xl font-bold text-center">
                {code}
              </Text>
              <Text>
                This code will only be valid for{" "}
                <span className="font-bold">15 minutes</span>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export async function getEmailVerificationHtml(username: string, code: string) {
  const html = await renderAsync(
    <EmailVerificationTemplate username={username} code={code} />,
    { pretty: true }
  );
  return html;
}

export async function getEmailVerificationText(username: string, code: string) {
  const text = await renderAsync(
    <EmailVerificationTemplate username={username} code={code} />,
    { plainText: true }
  );
  return text;
}
