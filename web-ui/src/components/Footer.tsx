import { Box, styled, Theme } from "@mui/material";

const StyledImage = styled("img")(({ theme }: { theme: Theme }) => ({
  width: theme.spacing(13),
  // https://stackoverflow.com/questions/22252472/how-to-change-the-color-of-an-svg-element
  filter:
    "invert(28%) sepia(61%) saturate(1182%) hue-rotate(204deg) brightness(98%) contrast(94%)",
}));

export const Footer = () => {
  return (
    <Box display="flex" alignItems="flex-end" mr={2} mb={2} justifyContent="flex-end">
      <Box pr={1} pb={1/2} color="hidden">Powered by</Box>
      <Box>
        <StyledImage
          alt="Choreo logo"
          src="https://wso2.cachefly.net/wso2/sites/all/2020-theme/images/choreo-logo-black.svg"
        />
      </Box>
    </Box>
  );
};

export default Footer;
