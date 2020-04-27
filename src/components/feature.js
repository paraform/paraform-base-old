/** @jsx jsx */
import { jsx, Flex, Box, Heading } from "theme-ui";
import RichText from "./rich-text";

function Feature(props) {
  const { featureItem, layout, reversed, shadow } = props;
  const imageSize = layout == "tripleFeature" ? 240 : 700;
  const imageSize2x = layout == "tripleFeature" ? 480 : 1400;
  return (
    <>
      {featureItem?.map((feature, index) => {
        return (
          <Flex
            sx={
              layout == "tripleFeature"
                ? { flexDirection: ["column", "row", "column"] }
                : reversed == true
                ? { flexDirection: ["column", "row-reverse"] }
                : { flexDirection: ["column", "row"] }
            }
            key={index}
          >
            <Flex
              sx={{
                width: ["100%", "50%", "100%"],
                height: layout == "tripleFeature" ? imageSize : "none",
                justifyContent: "center",
                mt: layout == "tripleFeature" ? 0 : [0, null, null, -10],
                mb: layout == "tripleFeature" ? 4 : [0, null, null, -40],
                p: 5,
              }}
            >
              {feature.image ? (
                <Flex
                  maxHeight={["480px", "700px"]}
                  sx={
                    shadow
                      ? {
                          borderRadius: 32,
                          boxShadow:
                            "0.625rem 0.875rem 2.5rem rgba(0, 0, 0, 0.2)",
                        }
                      : null
                  }
                >
                  <img
                    src={`${feature.image.url}?auto=format&fit=clip&h=${imageSize}`}
                    srcSet={`${feature.image.url}?auto=format&fit=clip&h=${imageSize} 1x, ${feature.image.url}?auto=format&fit=clip&h=${imageSize2x} 2x`}
                    alt={feature.alt || ""}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: ["contain"],
                      objectPosition: ["top", null, "center"],
                    }}
                  />
                </Flex>
              ) : null}
            </Flex>
            <Flex
              textAlign={
                layout == "tripleFeature"
                  ? ["center", "left", "center"]
                  : ["center", "left", "center"]
              }
              sx={{
                width: ["100%", "50%", "100%"],
                flexDirection: ["column"],
                alignSelf: "center",
                mt: [5, 0],
              }}
            >
              <Box sx={{ maxWidth: 380, margin: "0 auto" }}>
                <Heading as="h3" variant={"heading3"}>
                  {feature.title}
                </Heading>
                {feature.text ? (
                  <Box
                    sx={
                      layout == "tripleFeature"
                        ? {
                            fontSize: 1,
                          }
                        : {
                            fontSize: 2,
                          }
                    }
                  >
                    <RichText content={feature.text} />
                  </Box>
                ) : null}
              </Box>
            </Flex>
          </Flex>
        );
      })}
    </>
  );
}

export default Feature;