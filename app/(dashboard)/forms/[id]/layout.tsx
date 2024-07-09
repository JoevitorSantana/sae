import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
    return<div className="flex w-full flex-col flex-grow mx-auto">{children}</div>;
}

export default Layout;