import client from "./sanity";

const pageQuery = `
  name,
  title,
  description,
  'slug': slug.current,
  "ogImage": ogImage.asset->url
`;

const image = `
  _type == 'imageAsset' => {
    alt,
    "image": image.asset->url
  }
`;

const animation = `
  _type == 'animation' => @-> {
    data
  }
`;

const media = `
  'media': media[] | ({
    ${image},
    ${animation}
  })
`;

const appearance = `
 'appearance': appearance {
   "backgroundColor": backgroundColor->color.hex,
   "textColor": textColor->color.hex,
   backgroundGradient,
   "gradientFrom": gradientFrom->color.rgb,
   "gradientTo": gradientTo->color.rgb,
   backgroundVideo,
   spacing
 }
`;

const dividerSection = `
  _type == 'dividerSection' => {
    _type, 
    "shape": shape->data,
    "topColor": topColor->color.hex,
    "bottomColor": bottomColor->color.hex
  }
`;

const heroSection = `
  _type == 'heroSection' => {
    _type, 
    heading, 
    subheading, 
    ${media},
    ${appearance} ,
    "video": video.asset->url,
    subscribeField,
    contactEmail,
    mailchimpUrl,
    buttonText,
    flashButton,
    inputText,
  }
`;

const featureItem = `
  _type,
  reversed,
  shadow,
  "featureItem": featureItem[] -> {
    title, 
    text, 
    overline,
    alt,
    ${media}
  }
`;

const featureSection = `
  _type == 'featureSection' => {
    _type, 
    heading, 
    ${appearance},
    "features": features[] | ({
      _type == 'tripleFeature' => {
        ${featureItem}
      },
      _type == 'singleFeature' => {
        ${featureItem}
      }
    }),
  }
`;

const testimonialItem = `
  _type,
  reversed,
  "testimonialItem": testimonialItem[] -> {
    quote, 
    name, 
  }
`;

const testimonialSection = `
  _type == 'testimonialSection' => {
    _type, 
    heading, 
    ${appearance},
    "testimonials": testimonials[] | ({
      _type == 'tripleTestimonial' => {
        ${testimonialItem}
      },
      _type == 'singleTestimonial' => {
        ${testimonialItem}
      }
    }),
  }
`;

const subscribeSection = `
  _type == 'subscribeSection' => {
    _type, 
    heading, 
    subheading, 
    ${appearance} ,
    contactEmail,
    mailchimpUrl,
    buttonText,
    flashButton,
    inputText,
  }
`;

const sectionQuery = `
  'content': content[] | ({
   ${heroSection},
   ${featureSection},
   ${testimonialSection},
   ${subscribeSection}, 
   ${dividerSection}
  }),
`;

export async function getPages() {
  const data = await client.fetch(`*[_type == "page"]{ 'slug': slug.current }`);
  return data;
}

export async function getPageData(slug) {
  const [page, settings, theme] = await Promise.all([
    client
      .fetch(
        `*[_type == "page" && slug.current == $slug]{
        ${pageQuery},
        ${sectionQuery}
      }`,
        { slug }
      )
      .then((res) => res?.[0]),
    client
      .fetch(
        `*[_type == "settings"]{ 
        "name": name, 
        "banner": banner,
        "ogImage": ogImage.asset->url,
        instagram,
        twitter,
        facebook
      }`
      )
      .then((res) => res?.[0]),
    client.fetch(`*[_type in ["modes", "brandColors", "backgroundColors"]]{
      "color": name,
      "value": color.hex,
      'mode': mode[] | ({
        "background": background->color.hex,
        "text": text->color.hex,
        "mode": mode,
      })
    }`),
  ]);
  return { page, settings, theme };
}

// For later
// const getUniquePages = (pages) => {
//   const slugs = new Set();
//   return pages.filter((page) => {
//     if (slugs.has(page.slug)) {
//       return false;
//     } else {
//       slugs.add(page.slug);
//       return true;
//     }
//   });
// };
