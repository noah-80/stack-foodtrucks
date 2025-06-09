// Section.tsx
import React from "react";

import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

const Section = ({ children }: SectionProps) => (
  <section style={{ margin: "40px 0" }}>
    {children}
  </section>
);

export default Section;
