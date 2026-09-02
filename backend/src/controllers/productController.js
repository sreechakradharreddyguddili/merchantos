const Product = require("../models/Product");

const buildSearchableText = (productData) => {
  const values = [
    productData.name,
    productData.description,
    productData.category,
    ...(productData.features || []),
    ...(productData.tags || []),
    ...(productData.aiMetadata?.targetAudience || []),
    ...(productData.aiMetadata?.useCases || []),
    ...(productData.aiMetadata?.compatibleWith || []),
    ...(productData.aiMetadata?.sellingPoints || []),
  ];

  return values
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .trim();
};

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      compareAtPrice,
      currency,
      stock,
      sku,
      images,
      features,
      tags,
      specifications,
      aiMetadata,
    } = req.body;

    if (
      !name ||
      !description ||
      !category ||
      price === undefined ||
      !sku
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, category, price and SKU are required",
      });
    }

    const existingProduct = await Product.findOne({
      merchant: req.merchantId,
      sku: sku.toUpperCase(),
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this SKU already exists",
      });
    }

    const productData = {
      merchant: req.merchantId,
      name,
      description,
      category,
      price,
      compareAtPrice,
      currency,
      stock,
      sku: sku.toUpperCase(),
      images,
      features,
      tags,
      specifications,
      aiMetadata,
    };

    productData.aiMetadata = {
      ...(aiMetadata || {}),
      searchableText: buildSearchableText(productData),
    };

    const product = await Product.create(productData);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {
      merchant: req.merchantId,
      isActive: true,
    };

    if (category) {
      query.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};

      if (minPrice !== undefined) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (inStock === "true") {
      query.stock = {
        $gt: 0,
      };
    }

    if (search) {
      query.$text = {
        $search: search,
      };
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip(skip)
        .limit(limitNumber),

      Product.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.merchantId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.merchantId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "compareAtPrice",
      "currency",
      "stock",
      "images",
      "features",
      "tags",
      "specifications",
      "aiMetadata",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const productData = product.toObject();

    product.aiMetadata.searchableText =
      buildSearchableText(productData);

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      merchant: req.merchantId,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.isActive = false;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

const getAIProductCatalog = async (req, res) => {
  try {
    const products = await Product.find({
      merchant: req.merchantId,
      isActive: true,
      "aiMetadata.aiSearchEnabled": true,
      stock: {
        $gt: 0,
      },
    })
      .select(
        "name description category price currency stock sku features tags specifications aiMetadata"
      )
      .lean();

    const catalog = products.map((product) => ({
      id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      currency: product.currency,
      available: product.stock > 0,
      stock: product.stock,
      features: product.features,
      tags: product.tags,
      specifications: product.specifications,
      targetAudience: product.aiMetadata?.targetAudience || [],
      useCases: product.aiMetadata?.useCases || [],
      compatibleWith: product.aiMetadata?.compatibleWith || [],
      sellingPoints: product.aiMetadata?.sellingPoints || [],
    }));

    return res.status(200).json({
      success: true,
      data: {
        merchantId: req.merchantId,
        catalogVersion: "1.0",
        generatedAt: new Date(),
        totalProducts: catalog.length,
        products: catalog,
      },
    });
  } catch (error) {
    console.error("AI catalog error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI catalog",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAIProductCatalog,
};