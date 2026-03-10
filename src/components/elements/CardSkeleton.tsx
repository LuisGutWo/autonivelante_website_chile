"use client";
import React from "react";
import "./CardSkeleton.css";

interface CardSkeletonProps {
  variant?: "product" | "project" | "testimonial";
  count?: number;
  className?: string;
}

/**
 * CardSkeleton - Componente de skeleton para cards
 * Proporciona múltiples placeholders mientras se cargan los datos
 */
const CardSkeleton: React.FC<CardSkeletonProps> = ({
  variant = "product",
  count = 1,
  className = "",
}) => {
  const cards = Array.from({ length: count }, (_, i) => i);

  if (variant === "product") {
    return (
      <div className={`card-skeleton-container ${className}`}>
        {cards.map((_, index) => (
          <div key={index} className="card-skeleton card-skeleton-product">
            <div className="card-skeleton-image" />
            <div className="card-skeleton-content">
              <div className="card-skeleton-line card-skeleton-title" />
              <div className="card-skeleton-line card-skeleton-line-short" />
              <div className="card-skeleton-line card-skeleton-line-short" />
              <div className="card-skeleton-actions">
                <div className="card-skeleton-button card-skeleton-button-small" />
                <div className="card-skeleton-button card-skeleton-button-small" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "project") {
    return (
      <div className={`card-skeleton-container ${className}`}>
        {cards.map((_, index) => (
          <div key={index} className="card-skeleton card-skeleton-project">
            <div className="card-skeleton-image card-skeleton-image-large" />
            <div className="card-skeleton-content">
              <div className="card-skeleton-line card-skeleton-title" />
              <div className="card-skeleton-line" />
              <div className="card-skeleton-line card-skeleton-line-short" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // testimonial
  return (
    <div className={`card-skeleton-container ${className}`}>
      {cards.map((_, index) => (
        <div key={index} className="card-skeleton card-skeleton-testimonial">
          <div className="card-skeleton-avatar" />
          <div className="card-skeleton-content">
            <div className="card-skeleton-line card-skeleton-line-short" />
            <div className="card-skeleton-line" />
            <div className="card-skeleton-line" />
            <div className="card-skeleton-line card-skeleton-line-short" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardSkeleton;
