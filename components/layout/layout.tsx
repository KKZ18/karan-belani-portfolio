import React, { PropsWithChildren } from "react";

type LayoutProps = PropsWithChildren & { rawPageData?: any };

export default function Layout({ children }: LayoutProps) {
  return <>{children}</>;
}
