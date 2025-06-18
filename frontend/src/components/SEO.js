import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "GrievanceBox | Student Grievance System",
  description = "A web application for college students to securely submit, track, and resolve grievances with administrative transparency and efficiency.",
  keywords = "grievance system, college complaints, student portal",
  canonical = "",
  image = "%PUBLIC_URL%/image.png",
  type = "website",
}) => {
  const siteUrl = window.location.origin;
  const fullUrl = canonical ? `${siteUrl}${canonical}` : window.location.href;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;
