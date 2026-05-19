import math


def compare_embeddings(known, unknown):
    squared = [(a - b) ** 2 for a, b in zip(known, unknown)]
    return math.sqrt(sum(squared))
