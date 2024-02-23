/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
  OutlinedInput,
  Typography,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import clsx from "clsx";
import React, { useCallback, useContext, useEffect, useState } from "react";
import ConfigurationContext from "../../../context/Configuration";
import UserContext from "../../../context/User";
import HeadingView from "./HeadingView";
import { useTranslation } from 'react-i18next';
import useStyles from "./styles";

function VariationModal({ isVisible, toggleModal, data }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const classes = useStyles();
  const configuration = useContext(ConfigurationContext);
  const extraSmall = useMediaQuery(theme.breakpoints.down("lg"));
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const {
    restaurant: restaurantCart,
    setCartRestaurant,
    cart,
    addQuantity,
    addCartItem,
  } = useContext(UserContext);

  useEffect(() => {
    setSelectedVariation({
      ...data?.food.variations[0],
      addons: data?.food.variations[0].addons.map((fa) => {
        const addon = data?.addons.find((a) => a._id === fa);
        const addonOptions = addon.options.map((ao) => {
          return data?.options.find((o) => o._id === ao);
        });
        return {
          ...addon,
          options: addonOptions,
        };
      }),
    });
    return () => {
      setSelectedAddons([]);
      setSelectedVariation(null);
    };
  }, [data]);

  const onAdd = useCallback(() => {
    setQuantity(quantity + 1);
  }, []);

  const onRemove = useCallback(() => {
    setQuantity((prev) => {
      if (prev > 1) return prev - 1;
      else return prev;
    });
  }, []);

  const calculatePrice = useCallback(() => {
    const variation = selectedVariation?.price;
    let addons = 0;
    selectedAddons?.forEach((addon) => {
      addons += addon.options.reduce((acc, option) => {
        return acc + option.price;
      }, 0);
    });
    return (variation + addons).toFixed(2);
  }, [data, selectedVariation]);

  const onSelectVariation = useCallback(
    (variation) => {
      setSelectedVariation({
        ...variation,
        addons: variation.addons.map((fa) => {
          const addon = data?.addons.find((a) => a._id === fa);
          const addonOptions = addon.options.map((ao) => {
            return data?.options.find((o) => o._id === ao);
          });
          return {
            ...addon,
            options: addonOptions,
          };
        }),
      });
    },
    [data]
  );

  const onSelectOption = async (addon, option) => {
    const index = selectedAddons.findIndex((ad) => ad._id === addon._id);
    if (index > -1) {
      if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
        selectedAddons[index].options = [option];
      } else {
        const optionIndex = selectedAddons[index].options.findIndex(
          (opt) => opt._id === option._id
        );
        if (optionIndex > -1) {
          selectedAddons[index].options = selectedAddons[index].options.filter(
            (opt) => opt._id !== option._id
          );
        } else {
          selectedAddons[index].options.push(option);
        }
        if (!selectedAddons[index].options.length) {
          selectedAddons.splice(index, 1);
        }
      }
    } else {
      selectedAddons.push({ _id: addon._id, options: [option] });
    }
    setSelectedAddons([...selectedAddons]);
  };

  const validateButton = () => {
    if (!selectedVariation) return false;
    const validatedAddons = [];
    selectedVariation?.addons?.forEach((addon) => {
      const selected = selectedAddons.find((ad) => ad._id === addon._id);
      if (!selected && addon.quantityMinimum === 0) {
        validatedAddons.push(false);
      } else if (
        selected &&
        selected.options.length >= addon.quantityMinimum &&
        selected.options.length <= addon.quantityMaximum
      ) {
        validatedAddons.push(false);
      } else validatedAddons.push(true);
    });
    return validatedAddons.every((val) => val === false);
  };

  const validateOrderItem = () => {
    const validatedAddons = selectedVariation?.addons.map((addon) => {
      const selected = selectedAddons.find((ad) => ad._id === addon._id);

      if (!selected && addon.quantityMinimum === 0) {
        addon.error = false;
      } else if (
        selected &&
        selected.options.length >= addon.quantityMinimum &&
        selected.options.length <= addon.quantityMaximum
      ) {
        addon.error = false;
      } else addon.error = true;
      return addon;
    });
    setSelectedVariation({ ...selectedVariation, addons: validatedAddons });
    return validatedAddons.every((addon) => addon.error === false);
  };

  const onPressAddToCart = async () => {
    if (validateOrderItem()) {
      if (!restaurantCart || data?.restaurant === restaurantCart) {
        await addToCart(quantity, data?.restaurant !== restaurantCart);
      }
    }
  };

  const addToCart = async (quantity, clearFlag) => {
    const addons = selectedAddons?.map((addon) => ({
      ...addon,
      options: addon.options.map(({ _id }) => ({
        _id,
      })),
    }));

    const cartItem = clearFlag
      ? null
      : cart.find((cartItem) => {
          if (
            cartItem._id === data?.food._id &&
            cartItem.variation._id === selectedVariation?._id
          ) {
            if (cartItem.addons.length === addons.length) {
              if (addons.length === 0) return true;
              const addonsResult = addons.every((newAddon) => {
                const cartAddon = cartItem.addons.find(
                  (ad) => ad._id === newAddon._id
                );

                if (!cartAddon) return false;
                const optionsResult = newAddon.options.every((newOption) => {
                  const cartOption = cartAddon.options.find(
                    (op) => op._id === newOption._id
                  );

                  if (!cartOption) return false;
                  return true;
                });

                return optionsResult;
              });

              return addonsResult;
            }
          }
          return false;
        });

    if (!cartItem) {
      await setCartRestaurant(data?.restaurant);
      await addCartItem(
        data?.food?._id,
        selectedVariation?._id,
        quantity,
        addons,
        clearFlag,
        specialInstructions
      );
    } else {
      await addQuantity(cartItem.key, quantity);
    }
    toggleModal();
  };

  const radioORcheckboxes = useCallback(
    (addon) => {
      if (addon.quantityMinimum === 1 && addon.quantityMaximum === 1) {
        return (
          <RadioGroup>
            {addon?.options.map((option, index) => (
              <Box
                key={`OPTIONS_${option._id}`}
                display="flex"
                justifyContent="space-between"
              >
                <FormControlLabel
                  value={option._id}
                  onClick={() => onSelectOption(addon, option)}
                  control={<Radio color="primary" />}
                  label={
                    <Typography
                      style={{ color: theme.palette.text.secondary }}
                      className={classes.priceTitle}
                    >
                      {option.title}
                    </Typography>
                  }
                />
                <Typography className={classes.priceTitle}>
                  {`${configuration.currencySymbol} ${option.price.toFixed(2)}`}
                </Typography>
              </Box>
            ))}
          </RadioGroup>
        );
      } else {
        return addon?.options.map((option, index) => (
          <Box
            key={`OPTIONS_${option._id}_${index}`}
            display="flex"
            justifyContent="space-between"
          >
            <FormControlLabel
              control={<Checkbox color="primary" />}
              onClick={() => onSelectOption(addon, option)}
              name={option._id}
              label={
                <Typography
                  style={{ color: theme.palette.text.secondary }}
                  className={classes.priceTitle}
                >
                  {option.title}
                </Typography>
              }
            />
            <Typography className={classes.priceTitle}>
              {`${configuration.currencySymbol} ${option.price.toFixed(2)}`}
            </Typography>
          </Box>
        ));
      }
    },
    [selectedVariation]
  );

  return (
    <>
      <Dialog
        fullScreen={extraSmall}
        onClose={toggleModal}
        open={isVisible}
        fullWidth={true}
        maxWidth="lg"
        pt={theme.spacing(0.5)}
        className={classes.root}
      >
        <Box className={classes.outerContainer}>
          <Box
            className={classes.imageContainer}
            style={{
              backgroundImage: `url('${data?.image ?? ""}')`,
            }}
          >
            <Typography variant="h4" color="white" style={{ fontWeight: 600 }}>
              {t('customize')}
            </Typography>
            <Button onClick={toggleModal} className={classes.closeContainer}>
              <CloseIcon style={{ color: "black" }} />
            </Button>
          </Box>
          <Paper className={classes.innerContainer}>
            <Box className={classes.lowerContainer}>
              <DialogTitle>
                <Box display="flex" justifyContent="space-between">
                  <Typography className={classes.itemTitle}>
                    {data?.food?.title ?? ""}
                  </Typography>
                  <Typography className={classes.priceTitle}>{` ${
                    configuration.currencySymbol
                  } ${calculatePrice()}`}</Typography>
                </Box>
                <Box mb={theme.spacing(2)}>
                  <Typography className={classes.priceTitle}>
                    {data?.food?.description ?? ""}
                  </Typography>
                </Box>
                <Divider orientation="horizontal" />
              </DialogTitle>
              <DialogContent>
                {data?.food.variations.length > 1 && (
                  <>
                    <HeadingView />
                    <FormControl style={{ width: "100%" }}>
                      <RadioGroup>
                        {data?.food.variations.map((variation, index) => (
                          <Box
                            key={`ADDONS_${index}`}
                            display="flex"
                            justifyContent="space-between"
                          >
                            <FormControlLabel
                              checked={variation._id === selectedVariation._id}
                              value={variation._id}
                              onClick={() => onSelectVariation(variation)}
                              control={<Radio color="primary" />}
                              label={
                                <Typography
                                  style={{
                                    color: theme.palette.text.secondary,
                                  }}
                                  className={classes.priceTitle}
                                >
                                  {variation.title}
                                </Typography>
                              }
                            />
                            
                            <Typography className={classes.priceTitle}>
                              {`${
                                configuration.currencySymbol
                              } ${variation.price.toFixed(2)}`}
                            </Typography>
                          </Box>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <Divider orientation="horizontal" style={{marginBottom: "10px"}}/>
                  </>
                )}
                <Box />
                <FormControl style={{ flex: 1, display: "flex" }}>
                  <FormGroup>
                    {selectedVariation?.addons?.map((addon, index) => (
                      <Box key={`VARIATION_${index}`}>
                        <HeadingView
                          title={addon.title}
                          subTitle={addon.description}
                          error={addon.error}
                          status={
                            addon.quantityMinimum === 0
                              ? t('optional')
                              : `${addon.quantityMinimum} ${t('required')}`
                          }
                        />
                        {radioORcheckboxes(addon)}
                      </Box>
                    ))}
                  </FormGroup>
                  <FormGroup>
                    <HeadingView
                      title={t('specialInstructions')}
                      subTitle={t('anySpecific')}
                      status={t('optional')}
                      error={false}
                    />
                    <Box mt={theme.spacing(2)} />
                    <OutlinedInput
                      id="special-instructions"
                      name="special-instructions"
                      multiline
                      minRows={2}
                      maxRows={3}
                      value={specialInstructions}
                      onChange={(event) =>
                        setSpecialInstructions(event.target.value)
                      }
                      placeholder={t('placeholder')}
                      variant="filled"
                      color="primary"
                      inputProps={{
                        style: { color: theme.palette.grey[600] },
                        maxLength: 144,
                      }}
                      size="small"
                    />
                  </FormGroup>
                </FormControl>
              </DialogContent>
              <DialogActions>
                <Box
                  style={{ background: "white", width: "100%", height: "75px" }}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <IconButton
                    size="small"
                    className={classes.mr}
                    style={{
                      minWidth: "auto",
                      backgroundColor: theme.palette.common.black,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onRemove();
                    }}
                  >
                    <RemoveIcon fontSize="medium" style={{ color: "white" }} />
                  </IconButton>
                  <Typography
                    style={{
                      fontSize: "1.25rem",
                      border: "1px solid",
                      padding: "5px 15px",
                      borderRadius: 10,
                    }}
                    className={`${classes.mr} ${classes.itemTitle}`}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    className={classes.mr}
                    style={{
                      minWidth: "auto",
                      backgroundColor: theme.palette.common.black,
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onAdd();
                    }}
                  >
                    <AddIcon fontSize="medium" style={{ color: "white" }} />
                  </IconButton>
                  <Button
                    variant="contained"
                    color="primary"
                    className={clsx(classes.checkoutContainer, {
                      [classes.disableBtn]: !validateButton(),
                    })}
                    onClick={(e) => {
                      e.preventDefault();
                      onPressAddToCart();
                    }}
                  >
                    <Typography className={classes.checkoutText}>
                      {t('addToCart')}
                    </Typography>
                  </Button>
                </Box>
              </DialogActions>
            </Box>
          </Paper>
        </Box>
      </Dialog>
    </>
  );
}
export default React.memo(VariationModal);
