"""Utilities related to Boggle game."""

from random import choice
import string


class Boggle:
    def __init__(self):
        self.words = self.read_dict("words.txt")

    def read_dict(self, dict_path):
        """Read and return all words in dictionary."""
        with open(dict_path) as dict_file:
            return [w.strip() for w in dict_file]

    def make_board(self):
        """Make and return a random boggle board."""
        return [[choice(string.ascii_uppercase) for _ in range(5)] for _ in range(5)]

    def check_valid_word(self, board, word):
        """Check if a word is valid in the dictionary and/or the boggle board."""
        word_exists = word in self.words
        valid_word = self.find(board, word.upper())
        return "ok" if word_exists and valid_word else "not-on-board" if word_exists else "not-word"

    def find(self, board, word):
        """Can word be found in board?"""
        for y in range(5):
            for x in range(5):
                if self.find_from(board, word, y, x, seen=set()):
                    return True
        return False

    def find_from(self, board, word, y, x, seen):
        """Can we find a word on board, starting at x, y?"""
        if not (0 <= x < 5 and 0 <= y < 5) or (y, x) in seen or board[y][x] != word[0]:
            return False
        if len(word) == 1:
            return True

        seen.add((y, x))
        for dy in [-1, 0, 1]:
            for dx in [-1, 0, 1]:
                if dy == 0 and dx == 0:
                    continue
                if self.find_from(board, word[1:], y + dy, x + dx, seen):
                    return True
        seen.remove((y, x))  # Backtrack
        return False