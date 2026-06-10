export function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    defaultCurrency: user.default_currency,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
