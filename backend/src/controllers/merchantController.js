const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Merchant = require("../models/Merchant");

const generateToken = (merchantId) => {
  return jwt.sign(
    {
      merchantId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const isEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
};

const normalizePhone = (value) => {
  return String(value)
    .trim()
    .replace(/[\s()-]/g, "");
};

const isPhone = (value) => {
  const normalized = normalizePhone(value);

  return /^\+?[0-9]{10,15}$/.test(
    normalized
  );
};

const getMerchantResponse = (merchant) => {
  return {
    id: merchant._id,
    businessName: merchant.businessName,
    email: merchant.email,
    phone: merchant.phone,
    businessType: merchant.businessType,
    currency: merchant.currency,
    growthSettings: merchant.growthSettings,
  };
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/

const registerMerchant = async (req, res) => {
  try {
    const {
      businessName,
      email,
      phone,
      identifier,
      password,
      businessType,
    } = req.body;

    if (!businessName || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Business name and password are required",
      });
    }

    const loginIdentifier =
      String(
        identifier ||
          email ||
          phone ||
          ""
      ).trim();

    if (!loginIdentifier) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number is required",
      });
    }

    let normalizedEmail = null;
    let normalizedPhone = null;

    if (isEmail(loginIdentifier)) {
      normalizedEmail =
        loginIdentifier.toLowerCase();
    } else if (isPhone(loginIdentifier)) {
      normalizedPhone =
        normalizePhone(loginIdentifier);
    } else {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid email address or phone number",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate email
    |--------------------------------------------------------------------------
    */

    if (normalizedEmail) {
      const existingMerchant =
        await Merchant.findOne({
          email: normalizedEmail,
        });

      if (existingMerchant) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this email already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Check duplicate phone
    |--------------------------------------------------------------------------
    */

    if (normalizedPhone) {
      const existingMerchant =
        await Merchant.findOne({
          phone: normalizedPhone,
        });

      if (existingMerchant) {
        return res.status(409).json({
          success: false,
          message:
            "An account with this phone number already exists",
        });
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Password
    |--------------------------------------------------------------------------
    */

    const hashedPassword =
      await bcrypt.hash(
        password,
        12
      );

    /*
    |--------------------------------------------------------------------------
    | Create merchant
    |--------------------------------------------------------------------------
    */

    const merchantData = {
      businessName: businessName.trim(),

      password: hashedPassword,

      businessType:
        businessType || "ecommerce",
    };

    if (normalizedEmail) {
      merchantData.email =
        normalizedEmail;
    }

    if (normalizedPhone) {
      merchantData.phone =
        normalizedPhone;
    }

    const merchant =
      await Merchant.create(
        merchantData
      );

    const token =
      generateToken(merchant._id);

    return res.status(201).json({
      success: true,
      message:
        "Merchant registered successfully",

      data: {
        merchant:
          getMerchantResponse(
            merchant
          ),

        token,
      },
    });
  } catch (error) {
    console.error(
      "Register merchant error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email or phone number already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "Failed to register merchant",
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/

const loginMerchant = async (
  req,
  res
) => {
  try {
    const {
      email,
      phone,
      identifier,
      password,
    } = req.body;

    const loginIdentifier =
      String(
        identifier ||
          email ||
          phone ||
          ""
      ).trim();

    if (
      !loginIdentifier ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email or phone number and password are required",
      });
    }

    let merchant;

    /*
    |--------------------------------------------------------------------------
    | Login using email
    |--------------------------------------------------------------------------
    */

    if (isEmail(loginIdentifier)) {
      merchant =
        await Merchant.findOne({
          email:
            loginIdentifier.toLowerCase(),
        }).select("+password");
    }

    /*
    |--------------------------------------------------------------------------
    | Login using phone
    |--------------------------------------------------------------------------
    */

    else if (isPhone(loginIdentifier)) {
      merchant =
        await Merchant.findOne({
          phone:
            normalizePhone(
              loginIdentifier
            ),
        }).select("+password");
    }

    else {
      return res.status(400).json({
        success: false,
        message:
          "Enter a valid email address or phone number",
      });
    }

    if (!merchant) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email/phone number or password",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        merchant.password
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email/phone number or password",
      });
    }

    const token =
      generateToken(merchant._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",

      data: {
        merchant:
          getMerchantResponse(
            merchant
          ),

        token,
      },
    });
  } catch (error) {
    console.error(
      "Login merchant error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to login",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

const getMerchantProfile = async (
  req,
  res
) => {
  try {
    const merchant =
      await Merchant.findById(
        req.merchantId
      );

    if (!merchant) {
      return res.status(404).json({
        success: false,
        message:
          "Merchant not found",
      });
    }

    return res.status(200).json({
      success: true,

      data: {
        merchant,
      },
    });
  } catch (error) {
    console.error(
      "Get merchant profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch merchant profile",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE MERCHANT SETTINGS
|--------------------------------------------------------------------------
*/

const updateMerchantSettings =
  async (req, res) => {
    try {
      const {
        maxDiscountPercentage,
        maxCampaignBudget,
        requireApprovalForFinancialActions,
        allowAutomaticCampaigns,
      } = req.body;

      const merchant =
        await Merchant.findById(
          req.merchantId
        );

      if (!merchant) {
        return res.status(404).json({
          success: false,
          message:
            "Merchant not found",
        });
      }

      if (
        maxDiscountPercentage !==
        undefined
      ) {
        merchant.growthSettings.maxDiscountPercentage =
          Number(
            maxDiscountPercentage
          );
      }

      if (
        maxCampaignBudget !==
        undefined
      ) {
        merchant.growthSettings.maxCampaignBudget =
          Number(
            maxCampaignBudget
          );
      }

      if (
        requireApprovalForFinancialActions !==
        undefined
      ) {
        merchant.growthSettings.requireApprovalForFinancialActions =
          Boolean(
            requireApprovalForFinancialActions
          );
      }

      if (
        allowAutomaticCampaigns !==
        undefined
      ) {
        merchant.growthSettings.allowAutomaticCampaigns =
          Boolean(
            allowAutomaticCampaigns
          );
      }

      await merchant.save();

      return res.status(200).json({
        success: true,
        message:
          "Merchant settings updated successfully",

        data: {
          merchant:
            getMerchantResponse(
              merchant
            ),
        },
      });
    } catch (error) {
      console.error(
        "Update merchant settings error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update merchant settings",
      });
    }
  };

module.exports = {
  registerMerchant,
  loginMerchant,
  getMerchantProfile,
  updateMerchantSettings,
};