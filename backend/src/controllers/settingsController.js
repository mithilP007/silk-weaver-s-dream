const prisma = require("../config/prisma");

// --- Shipping Settings ---
const getShippingSettings = async (req, res) => {
  try {
    let settings = await prisma.shippingSettings.findFirst();

    // Dynamically initialize default shipping settings if none exist
    if (!settings) {
      settings = await prisma.shippingSettings.create({
        data: {
          freeShippingAbove: 4999,
          shippingCharge: 99,
          codEnabled: true,
          deliveryDays: 5,
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shipping settings",
      error: error.message,
    });
  }
};

const updateShippingSettings = async (req, res) => {
  try {
    const { freeShippingAbove, shippingCharge, codEnabled, deliveryDays } = req.body;

    let settings = await prisma.shippingSettings.findFirst();

    if (!settings) {
      settings = await prisma.shippingSettings.create({
        data: {
          freeShippingAbove: parseFloat(freeShippingAbove || 4999),
          shippingCharge: parseFloat(shippingCharge || 99),
          codEnabled: codEnabled !== undefined ? codEnabled : true,
          deliveryDays: parseInt(deliveryDays || 5),
        },
      });
    } else {
      settings = await prisma.shippingSettings.update({
        where: { id: settings.id },
        data: {
          freeShippingAbove: freeShippingAbove !== undefined ? parseFloat(freeShippingAbove) : settings.freeShippingAbove,
          shippingCharge: shippingCharge !== undefined ? parseFloat(shippingCharge) : settings.shippingCharge,
          codEnabled: codEnabled !== undefined ? codEnabled : settings.codEnabled,
          deliveryDays: deliveryDays !== undefined ? parseInt(deliveryDays) : settings.deliveryDays,
        },
      });
    }

    res.status(200).json({
      success: true,
      message: "Shipping settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update shipping settings",
      error: error.message,
    });
  }
};

// --- Payment Settings ---
const getPaymentSettings = async (req, res) => {
  try {
    let settings = await prisma.paymentSettings.findFirst();

    // Dynamically initialize default payment settings if none exist
    if (!settings) {
      settings = await prisma.paymentSettings.create({
        data: {
          razorpayKeyId: "rzp_test_Kamatchi90281",
          razorpaySecret: "dummysecretvalue12345678",
          razorpayEnabled: true,
        },
      });
    }

    // Hide secret in normal GET request for security
    const secureData = { ...settings };
    if (secureData.razorpaySecret) {
      secureData.razorpaySecret = "••••••••••••••••••••••••";
    }

    res.status(200).json({
      success: true,
      data: secureData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment settings",
      error: error.message,
    });
  }
};

const updatePaymentSettings = async (req, res) => {
  try {
    const { razorpayKeyId, razorpaySecret, razorpayEnabled } = req.body;

    let settings = await prisma.paymentSettings.findFirst();

    // Prepare update body (preserve existing secret if masked bullet string is received)
    const updateData = {};
    if (razorpayKeyId !== undefined) updateData.razorpayKeyId = razorpayKeyId;
    if (razorpaySecret !== undefined && razorpaySecret !== "••••••••••••••••••••••••" && !razorpaySecret.includes("••••")) {
      updateData.razorpaySecret = razorpaySecret;
    }
    if (razorpayEnabled !== undefined) updateData.razorpayEnabled = razorpayEnabled;

    if (!settings) {
      settings = await prisma.paymentSettings.create({
        data: {
          razorpayKeyId: razorpayKeyId || "rzp_test_Kamatchi90281",
          razorpaySecret: razorpaySecret && !razorpaySecret.includes("••••") ? razorpaySecret : "dummysecretvalue12345678",
          razorpayEnabled: razorpayEnabled !== undefined ? razorpayEnabled : true,
        },
      });
    } else {
      settings = await prisma.paymentSettings.update({
        where: { id: settings.id },
        data: updateData,
      });
    }

    const secureData = { ...settings };
    if (secureData.razorpaySecret) {
      secureData.razorpaySecret = "••••••••••••••••••••••••";
    }

    res.status(200).json({
      success: true,
      message: "Payment settings updated successfully",
      data: secureData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update payment settings",
      error: error.message,
    });
  }
};

// --- Home Banners & Settings ---
const getHomeSettings = async (req, res) => {
  try {
    let settings = await prisma.homeSettings.findFirst();

    if (!settings) {
      settings = await prisma.homeSettings.create({
        data: {
          heroTitle: "Draped in Timeless Elegance",
          heroSubtitle: "Discover the soul of South Indian craftsmanship. Handwoven Kanchipuram and luxury silk sarees.",
          heroImage: "/uploads/products/hero-saree.jpg",
          offerBanner: "Up to 30% off on bridal Kanchipuram silks. Make your big day unforgettable.",
        },
      });
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch homepage settings",
      error: error.message,
    });
  }
};

const updateHomeSettings = async (req, res) => {
  try {
    const { heroTitle, heroSubtitle, heroImage, offerBanner } = req.body;

    let settings = await prisma.homeSettings.findFirst();

    const data = { heroTitle, heroSubtitle, heroImage, offerBanner };

    if (!settings) {
      settings = await prisma.homeSettings.create({ data });
    } else {
      settings = await prisma.homeSettings.update({
        where: { id: settings.id },
        data,
      });
    }

    res.status(200).json({
      success: true,
      message: "Homepage settings updated successfully",
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update homepage settings",
      error: error.message,
    });
  }
};

module.exports = {
  getShippingSettings,
  updateShippingSettings,
  getPaymentSettings,
  updatePaymentSettings,
  getHomeSettings,
  updateHomeSettings,
};
