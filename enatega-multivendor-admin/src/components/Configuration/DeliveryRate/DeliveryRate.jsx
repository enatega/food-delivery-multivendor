import React, { useState, useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { useMutation, gql } from '@apollo/client';
import { validateFunc } from '../../../constraints/constraints';
import { saveDeliveryRateConfiguration } from '../../../apollo';
import { Box, Typography, Input, Button, Alert, Select, MenuItem } from '@mui/material';
import useStyles from '../styles';
import useGlobalStyles from '../../../utils/globalStyles';

const SAVE_DELIVERY_RATE_CONFIGURATION = gql`
  ${saveDeliveryRateConfiguration}
`;

function Currency(props) {
  const { t } = props;
  const [deliveryRate, setDeliveryRate] = useState(props.deliveryRate || 0);
  const [costType, setCostType] = useState(props?.costType || 'perKM');
  const [deliveryRateError, setDeliveryRateError] = useState(null);
  const [mutate, { loading }] = useMutation(SAVE_DELIVERY_RATE_CONFIGURATION);

  const validateInput = () => {
    const deliveryRateErrors = !validateFunc({ deliveryRate: deliveryRate }, 'deliveryRate');
    setDeliveryRateError(deliveryRateErrors);
    return deliveryRateErrors;
  };

  const classes = useStyles();
  const globalClasses = useGlobalStyles();
  const [successMessage, setSuccessMessage] = useState('');
  const handleSuccess = (message) => {
    setSuccessMessage(message);
  };

  const handleCostTypeChange = (event) => {
    setCostType(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSuccessMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [successMessage, setSuccessMessage]);

  const [errorMessage, setErrorMessage] = useState('');
  const handleError = (error) => {
    setErrorMessage('An error occurred while saving configuration.');
    console.error('Mutation error:', error);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [errorMessage, setErrorMessage]);

  return (
    <Box container className={classes.container}>
      <Box className={classes.flexRow}>
        <Box item className={classes.heading}>
          <Typography variant="h6" className={classes.text}>
            {t('Delivery Rate')}
          </Typography>
        </Box>
      </Box>

      <Box className={classes.form}>
        <form>

        <Box>
            <Typography className={classes.labelText}>
              {t('CostType')}
            </Typography>
            <Select
              style={{ marginTop: -1 }}
              id="input-cost-type"
              name="input-cost-type"
              value={costType}
              onChange={handleCostTypeChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              className={[
                globalClasses.input,
                deliveryRateError === false
                  ? globalClasses.inputError
                  : deliveryRateError === true
                    ? globalClasses.inputSuccess
                    : '',
              ]}
            >
              <MenuItem style={{ color: 'black' }} value="perKM">{t('PerKM')}</MenuItem>
              <MenuItem style={{ color: 'black' }} value="fixed">{t('FixedCost')}</MenuItem>
            </Select>
          </Box>

          <Box>
            <Typography className={classes.labelText}>
              {t('DeliveryFee')}
            </Typography>
            <Input
              style={{ marginTop: -1 }}
              id="input-delivery-fee"
              name="input-delivery-fee"
              placeholder={t('DeliveryFee')}
              type="text"
              value={deliveryRate}
              onChange={(e) => {
                setDeliveryRate(e.target.value);
              }}
              disableUnderline
              className={[
                globalClasses.input,
                deliveryRateError === false
                  ? globalClasses.inputError
                  : deliveryRateError === true
                    ? globalClasses.inputSuccess
                    : '',
              ]}
            />
          </Box>

          <Box>
            <Button
              className={globalClasses.button}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                if (validateInput()) {
                  mutate({
                    variables: {
                      configurationInput: {
                        deliveryRate: Number(deliveryRate),
                        costType: costType,
                      },
                    },
                    onCompleted: (data) => {
                      handleSuccess('Configuration saved successfully!');
                    },
                    onError: (error) => {
                      handleError(error);
                    },
                  });
                }
              }}
            >
              {t('Save')}
            </Button>
          </Box>

          <Box mt={2}>
            {successMessage && (
              <Alert className={globalClasses.alertSuccess} variant="filled" severity="success">
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert className={globalClasses.alertError} variant="filled" severity="error">
                {errorMessage}
              </Alert>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
}

export default withTranslation()(Currency);